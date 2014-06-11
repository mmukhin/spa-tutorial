<?php

abstract class AbstractModel {

    abstract public function fetchAll();
    abstract public function fetchOne($id);
    abstract public function update();
    abstract public function create();
    abstract protected function save();
    abstract public function delete();
    abstract protected function startStorage();

    // Make sure to run this parent method within all child model constructors
    public function __construct()
    {
        $this->startStorage();
    }

    public function getFromArray($id, $array, $key = "id")
    {
        $found = null;
        foreach ($array as $a) {
            if ($a[$key] == $id) {
                $found = $a;
                break;
            }
        }
        return $found;
    }

    public function setError($_error)
    {
        $this->_error = $_error;
    }

    public function getError()
    {
        return $this->_error;
    }
}